import { API } from 'aws-amplify'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

const listItems = `
query listItems { 
    listItems { 
        id 
    }
}
`

const getItem = `
    query getItemById($itemId: String!) { 
        getItemById(itemId: $itemId){ 
            id name desc
        }
    }
`


export default function Item({ item }: AppProps) {
    const router = useRouter()
    if(router.isFallback) { 
        return <h2>Loading...</h2>
    }
    return (
        <div>
            <h1>{item.name}</h1>
            <h1>{item.desc}</h1>
        </div>
    )
    
}


export async function getStaticPaths() {
    const itemData = await API.graphql({ 
        query: listItems
    })
    const paths = itemData.data.listItems.items.map(item => ( { params: { id: item.id }}))
    return { 
        paths, 
        fallback: true
    }
}
export async function getStaticProps({params}) {
        const { id } = params
        const itemData = await API.graphql( { 
            query: getItem, variables: { id }
        })
        return { 
            props: {

                item : itemData.data.getItem
            }
        }
}