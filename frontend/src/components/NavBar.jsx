import { BiHome } from "react-icons/bi"
import { PiNetwork } from "react-icons/pi"
import { HiMiniComputerDesktop } from "react-icons/hi2"
import "./NavBar.css"

export default function NavBar({ currentUrl }) {
    const navItems = [
        { name: "Home", icon: <BiHome />, link: '/' },
        { name: "Network", icon: <PiNetwork />, link: '/network' },
        { name: "VM", icon: <HiMiniComputerDesktop />, link: '#' },
    ]

    return <>
        <nav>
            <ul className="menu">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <a href={item.link} className={`menu-item ${currentUrl === item.link ? "active" : ""}`}>
                            {item.icon}
                        </a>
                    </li>
                ))}
            </ul>
        </nav >
    </>
}