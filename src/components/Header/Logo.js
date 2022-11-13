import { Link } from "react-router-dom"

import logoImage from "../../assets/logo/logo_rocket.png"

function Logo() {
  return (
    <h1>
      <Link to="/" className="flex pt-2 pb-1">
        <img src={logoImage} alt="Team Rocket" className="h-12" />
        <span className="sr-only">로켓단의 한국정복</span>
      </Link>
    </h1>
  )
}

export default Logo
