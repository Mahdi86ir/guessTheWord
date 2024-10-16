import {useState} from 'react'
import './Container.css'
import Explain from '../Explain/Explain'
import Test from '../Test/Test'

export default function Container() {
    const [explain , setExplain] = useState<boolean>(true)
    
    const changeBool = (): void =>{
        setExplain(false)
    }

    return (
        <section className='container'>
            {explain ? <Explain trigger={changeBool}/> : <Test/>}
        </section>
    )
}
