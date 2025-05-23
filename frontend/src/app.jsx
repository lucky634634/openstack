import Router from 'preact-router'
import './app.css'
import { useState } from 'preact/hooks'
import Home from './pages/Home'
import Network from './pages/Network'
import NavBar from './components/NavBar'

export function App() {
	const [page, setPage] = useState("/")

	return (
		<>
			<NavBar currentUrl={page} />
			<div id='main'>
				<Router onChange={(e) => setPage(e.path)}>
					<Home path='/' />
					<Network path='/network' />
				</Router>
			</div>
		</>
	)
}
