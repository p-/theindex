import Layout from '../../components/layout'
import Tab from "../../components/tab";
import {getTabs} from "../../lib/tabs";
import {getColumns} from "../../lib/columns";

export default function Post({tabs, tab, columns}) {
    return <Layout tabs={tabs}>
        <Tab tab={tab} columns={columns}/>
    </Layout>
}

export async function getStaticPaths() {
    const paths = getTabs().map(tab => {
        return {
            params: {
                id: tab.id
            }
        }
    })

    return {
        paths,
        fallback: true,
    }
}

export async function getStaticProps({params}) {
    const tabs = getTabs()
    const tab = tabs.filter(t => t.id === params.id)[0]
    const columns = getColumns()

    return {
        props: {tabs, tab, columns},
        revalidate: 600
    };
}
