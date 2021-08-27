import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as rds from "@aws-cdk/aws-rds";
import * as ec2 from "@aws-cdk/aws-ec2";


export class CdkBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "appsync-inventory-backend",
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),

      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    const vpc = new ec2.Vpc(this, "InventoryAppVPC");

    const cluster = new rds.ServerlessCluster(this, "AuroraInventoryCluster", {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(
        this,
        "ParameterGroup",
        "default.aurora-postgresql10"
      ),
      defaultDatabaseName: "InventoryDB",
      vpc,
      scaling: { autoPause: cdk.Duration.seconds(0) }, //optional. if not set, then instance will pause after 5mins
    });

    // Create the Lambda function that will map GraphQL operations into Postgres
    const postFn = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: new lambda.AssetCode("lambda-fns"),
      handler: "index.handler",
      memorySize: 1024,
      environment: {
        CLUSTER_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret?.secretArn || "",
        DB_NAME: "InventoryDB",
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      },
    });

    // Grant access to the cluster from the Lambda function
    cluster.grantDataApiAccess(postFn);
    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource("lambdaDatasource", postFn);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listItems",
    });
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getItemById",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createItem",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateItem",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteItem",
    });

    new cdk.CfnOutput(this, "AppSyncAPIURL", {
      value: api.graphqlUrl
    });
    new cdk.CfnOutput(this, "AppSyncAPIKey", {
      value: api.apiKey || "",
    });
    new cdk.CfnOutput(this, "ProjectRegion", {
      value: this.region,
    });
  }
}

