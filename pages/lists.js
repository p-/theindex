import {siteName} from "../components/layout/Layout"
import Head from "next/head"
import React from "react"
import IconCollection from "../components/icons/IconCollection"
import useSWR from "swr"
import Error from "./_error"
import {getLists} from "../lib/db/lists"
import ListBoard from "../components/boards/ListBoard"

export default function Lists({lists: staticLists}) {
    let {data: lists, error} = useSWR("/api/lists")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    lists = lists || staticLists

    return <>
        <Head>
            <title>
                {"All user lists | " + siteName}
            </title>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Custom user lists on The Anime Index"}/>
            <meta name="twitter:description" content={"View all created user lists"}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <h2 className={"card-title"}>
                    <IconCollection/> All user lists
                </h2>
            </div>
        </div>

        <ListBoard lists={lists}/>
    </>
}

export async function getStaticProps() {
    const lists = await getLists()
    return {
        props: {
            lists
        },
        revalidate: 30
    }
}
