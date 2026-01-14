import { useState } from "react"
import { Link } from "react-router-dom"
// import styles from "./MainNav.module.scss";

const MainNav = () => {
  const [select, setSelect] = useState("Home")
  return (
    <div className="MainNav">
      <ul>
        <Link to="/main">
          <li
            className={`${select === "Main" ? "check" : ""}`}
            onClick={() => setSelect("Main")}
          >
            Main
          </li>
        </Link>
        <Link to="/plan">
          <li
            className={`${select === "Plan" ? "check" : ""}`}
            onClick={() => setSelect("Plan")}
          >
            Plan
          </li>
        </Link>
        <Link to="/review">
          <li
            className={`${select === "Review" ? "check" : ""}`}
            onClick={() => setSelect("Review")}
          >
            Review
          </li>
        </Link>
        <Link to="/recommend">
          <li
            className={`${select === "Recommend" ? "check" : ""}`}
            onClick={() => setSelect("Recommend")}
          >
            Recommend
          </li>
        </Link>
        <Link to="/album">
          <li
            className={`${select === "Album" ? "check" : ""}`}
            onClick={() => setSelect("Album")}
          >
            Album
          </li>
        </Link>
        <Link to="/theme">
          <li
            className={`${select === "Theme" ? "check" : ""}`}
            onClick={() => setSelect("Theme")}
          >
            Theme
          </li>
        </Link>
        <Link to="/ai">
          <li
            className={`${select === "AI" ? "check" : ""}`}
            onClick={() => setSelect("AI")}
          >
            AI
          </li>
        </Link>
        <Link to="/rag">
          <li
            className={`${select === "Rag" ? "check" : ""}`}
            onClick={() => setSelect("Rag")}
          >
            Setting
          </li>
        </Link>
      </ul>
    </div>
  )
}

export default MainNav
