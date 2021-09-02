import React from "react"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default class EditList extends React.Component {
    constructor({_id, lists, owner, name, nsfw, description}) {
        super({_id, lists, owner, name, nsfw, description})

        this.listDatalist = lists.map(l => l.name)
        this.state = {
            _id,
            owner,
            name: name || "",
            nsfw: nsfw || false,
            description: description || ""
        }
    }

    saveList() {
        if (this.state.name !== "") {
            let body = {
                owner: this.state.owner,
                name: this.state.name,
                nsfw: this.state.nsfw,
                description: this.state.description
            }
            if (this.state._id) {
                body._id = this.state._id
            }

            fetch("/api/edit/list", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(r => {
                if (r.status !== 200) {
                    alert("Failed to save data: Error " + r.status)
                } else {
                    alert("Changes have been saved")
                    if (typeof this.state._id === "undefined") {
                        window.location.href = escape("/lists")
                    }
                }
            })
        } else {
            alert("Wow, wow! Wait a minute bro, you forgot to fill in the name")
        }
    }

    render() {
        return <form>
            <div className={"row"}>
                <div className={"col-12 col-lg-6 mb-3"}>
                    <label htmlFor={"createListInputName"} className={"form-label"}>
                        Name
                    </label>
                    <input type={"text"} className={"form-control"} id={"createListInputName"}
                           value={this.state.name}
                           list={"createListInputNameDatalist"} aria-describedby={"createListInputNameHelp"}
                           placeholder={"Enter a name"} required={true}
                           onChange={(input) => {
                               this.setState({name: input.target.value})
                           }}/>
                    <datalist id={"createListInputNameDatalist"}>
                        {this.listDatalist.map(t => <option value={t} key={t}/>)}
                    </datalist>
                    <div id={"createListInputNameHelp"} className={"form-text"}>
                        Shown name of list
                    </div>
                </div>
                <div className={"col-12 col-lg-6 mb-3 form-check"}>
                    <input type="checkbox" className="form-check-input" id="createListInputNSFW" value={this.state.nsfw}
                           onChange={(input) => {
                               this.setState({nsfw: input.target.checked})
                           }}/>
                    <label className="form-check-label" htmlFor="createListInputNSFW">
                        NSFW: contains adult only content
                    </label>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="createListInputDescription" className="form-label">Description</label>
                <textarea className="form-control" id="createListInputDescription" rows="3"
                          placeholder={"Enter a fitting description"} value={this.state.description}
                          onChange={(input) => {
                              this.setState({description: input.target.value})
                          }}/>
            </div>
            <span className={"float-end"}>
                <button className={"btn btn-primary mb-2 me-2"} type="button" onClick={() => this.saveList()}>
                    <FontAwesomeIcon icon={["fas", "save"]} className={"me-2"}/>
                    {typeof this.state._id === "undefined" ? "Create list" : "Save changes"}
                </button>
                <Link href={"/lists"}>
                    <a className={"btn btn-outline-secondary mb-2"}>
                        All lists
                        <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                    </a>
                </Link>
            </span>
        </form>
    }
}