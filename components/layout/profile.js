import Image from "next/image"
import {signIn, signOut, useSession} from "next-auth/client"
import {Icon} from "react-icons-kit"
import {userCircle} from "react-icons-kit/fa/userCircle"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function Profile() {
    const [session] = useSession()

    return <li className="nav-item dropdown">
        <a className={"nav-link dropdown-toggle profile"} role="button"
           data-bs-toggle="dropdown" aria-expanded="false"
           id={"userNavDropdownLink"}>
            {session ?
                <div className={"d-flex"}>
                    <div className={"me-1"}>
                        <Image src={session.user.image} width={21} height={21}
                               className={"rounded-circle"} alt={"Discord profile picture"}/>
                    </div>
                    <span className={"d-none d-lg-block"}>
                        {session.user.name}
                    </span>
                </div>
                : <Icon icon={userCircle}/>}
        </a>
        <ul className="dropdown-menu dropdown-menu-end bg-4" aria-labelledby={"userNavDropdownLink"}>
            <li>
                <a className={"dropdown-item"}>
                    {session ? "You are signed in as:" : "You are not logged in"}
                </a>
            </li>
            {session ?
                <li>
                    <a className="dropdown-item">
                        {session.user.name}
                    </a>
                </li>
                : <></>}
            <li>
                <hr className="dropdown-divider"/>
            </li>
            <li>
                <a className="dropdown-item" onClick={() => {
                    if (session) {
                        signOut()
                    } else {
                        signIn("discord")
                    }
                }}>
                    {session ? <>
                        Sign out <FontAwesomeIcon icon={["fas", "sign-out-alt"]}/>
                    </> : <>
                        <FontAwesomeIcon icon={["fas", "sign-in-alt"]}/> Sign In
                    </>}
                </a>
            </li>
        </ul>
    </li>
}