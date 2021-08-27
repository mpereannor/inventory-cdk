import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { API } from 'aws-amplify'

import Amplify from 'aws-amplify'
import config from '../aws-exports'
Amplify.configure(config)

const listItems = `
query listItems { 
    listItems { 
        id name desc
    }
}
`
export default function Items() {
    const [items, setItems] = useState([])
    useEffect(() => {
        async function fetchItems() { 
            const itemData = await API.graphql({ 
                query: listItems
            })
            console.log("itemData: ", itemData)
            setItems(itemData.data.listItems)
        }
        fetchItems()
        
    }, [])
    return (
        <div className={styles.container}>
            { 
            items.map(item => (
                <Link key={item.id} href={`/items/${item.id}`}>
                <a>{item.name}</a>
                </Link>
            ))}
          
        </div>
    )
}