import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { API } from 'aws-amplify'

const listItems = `
query listItems { 
    listItems { 
        id 
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
        }
        fetchItems()
        
    }, [])
    return (
        <div className={styles.container}>
            { 
            items.map(item => (
                <Link to={`/items/${item.id}`}>
                <a>{item.name}</a>
                </Link>
            ))}
          
        </div>
    )
}