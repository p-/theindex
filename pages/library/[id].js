import {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {getLibraries} from "../../lib/db/libraries"
import {useSession} from "next-auth/client"
import {canEdit, isEditor} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import CollectionBoard from "../../components/boards/CollectionBoard"
import useSWR from "swr"
import Error from "../_error"
import {getByUrlId} from "../../lib/db/db"

export default function Tab({_id, library: staticLibrary}) {
    const [session] = useSession()
    let {data: library, error} = useSWR("/api/library/" + _id)

    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }
    library = library || staticLibrary

    return <>
        <Head>
            <title>
                {library.name + " | " + siteName}
            </title>
            <meta name="description" content={library.description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"Tab " + library.name + " on The Anime Index"}/>
            <meta name="twitter:description" content={library.description}/>
            <meta name="twitter:image" content={library.img}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h2>
                        {library.name}
                        <span className={"float-end"} style={{fontSize: "1.2rem"}}>
                            {library.nsfw ? <DataBadge data={false} name={"NSFW"}/> : <></>}
                            {canEdit(session) ? <Link href={"/edit/library/" + library._id}>
                                <a title={"Edit tab"} className={"ms-2"}>
                                    <IconEdit/>
                                </a>
                            </Link> : <></>}
                        </span>
                    </h2>
                </div>
                <p className={"card-text"} style={{
                    whiteSpace: "pre-line"
                }}>
                    {library.description}
                </p>
            </div>
        </div>

        <CollectionBoard _id={library._id} collections={library.collections} key={library._id} canEdit={isEditor(session)}/>
    </>
}

export async function getStaticPaths() {
    const libraries = await getLibraries()
    const paths = libraries.map(library => {
        return {
            params: {
                id: library.urlId
            }
        }
    })

    return {
        paths,
        fallback: "blocking",
    }
}

export async function getStaticProps({params}) {
    const library = await getByUrlId("libraries", params.id)
    if (!library) {
        return {
            notFound: true,
            revalidate: 30
        }
    }

    return {
        props: {
            _id: library._id,
            library
        },
        revalidate: 30
    }
}
