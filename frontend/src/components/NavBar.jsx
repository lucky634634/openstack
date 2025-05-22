import { PiNetwork } from 'react-icons/pi'
import './NavBar.css'
import { BiHome } from 'react-icons/bi'

export default function NavBar({ currentUrl }) {
    const menuItems = [
        { id: "Home", path: "/", icon: <BiHome /> },
        { id: "Network", path: "/network", icon: <PiNetwork /> },
    ]
    return <>
        <nav>
            <ul className='menu'>
                {menuItems.map((item) => {
                    return (
                        <li key={item.id} className={`menu-item ${currentUrl == item.path ? 'active' : ''}`}>
                            <a href={item.path}>{item.icon}</a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    </>
}