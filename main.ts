import axios from "axios";
import prompts from "prompts";
import cliSelect from "cli-select";
import { parse } from 'node-html-parser';

const domain = "https://shahed4u.team/"

class Http {

    readonly host: string
    readonly path: string
    readonly headers: any
    readonly pramaters: any
    
    constructor(host?: string, path?: string, headers?: any, params?: any) {
        this.host = host ? host : domain
        this.path = path ? path : ""
        this.pramaters = params ? params : {}
        this.headers = headers ? headers : {} 
    }
    async post(data: any) {
        return new Promise(resolve => {
            axios.request({
                method: "POST",
                url: this.host,
                headers: this.headers,
                params: this.pramaters,
                data: data,
            }).then(res => {
                resolve(res)
            })
        })
    }
    async get() {
        return new Promise(resolve => {
            axios.request({
                method: "GET",
                url: this.host,
                headers: this.headers,
                params: this.pramaters //ANCHOR - fucking js :)
            }).then((res) => {
                resolve(res)
            })
        })
    }
}

class Page {

    readonly src: string
    readonly img: string
    readonly title: string
    readonly page_link: string
    servers: any = []

    constructor(title: string, image: string, link: string) {
        this.src = ""
        this.img = image
        this.title = title
        this.page_link = link
    }
    async get_src() {
        let http = new Http(this.page_link)
        let page_raw:any = await http.get()
        let $ = parse(page_raw.data)
        let elemets = $.querySelectorAll(".server--item")
        for (let i of elemets) {
            http = new  Http(`${domain}wp-content/themes/Shahid4u-WP_HOME/Ajaxat/Single/Server.php`, undefined, {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-requested-with": "XMLHttpRequest",
                "Referer": this.page_link,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            })
            let video_element:any = await http.post(`id=${i.attrs["data-id"]}&i=${i.attrs["data-i"]}`)
            this.servers.push(video_element.data)
        }
        console.log(this.servers)
    }
}

class Api {
    results: Array<Page> = []
    constructor() {
        this.results = []
    }
    get_results(raw_page: string) {
        const $ = parse(raw_page)
        const data = $.querySelectorAll(".media-block")
        for (let i of data) {
            this.results[this.results.length] = new Page(
                i.getElementsByTagName("a")[0].attrs["title"],
                i.getElementsByTagName("img")[0].attrs["data-image"],
                i.getElementsByTagName("a")[0].attrs["href"] + "watch/"
            )
        }
    }
    get_pages_number(raw_page: string) { //FIXME - plese fix me i need to suckkk
        const $ = parse(raw_page)
        const data = $.querySelector(".paginate")
        const pages_element = data?.getElementsByTagName("li")
        return pages_element?.length? pages_element?.length - 1: 0
    }
}

async function main() {
    let results: String[] = []
    const response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Search anything !',
    });
    let api = new Api()
    let http = new  Http(domain, undefined, undefined, {
        s: response.value
    })
    let raw_page:any = await http.get()
    api.get_pages_number(raw_page.data)
    api.get_results(raw_page.data)
    for (let i of api.results) {
        results.push(i.title)
    }
    console.clear()
    cliSelect({
        values: results,
    }).then((res) => {
        console.clear()
        let selected = api.results[Number(res.id)]
        selected.get_src()
    });
}

main()