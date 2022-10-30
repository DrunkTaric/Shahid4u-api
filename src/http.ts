import axios from "axios"

export class http {
    constructor(url: string, search: string) {
        return new Promise(resolve => {
            axios.request({
                method: "GET",
                url: url,
                params: {
                    s: search.replace(" ", "+")
                }
            }).then((res) => {
                resolve(res.data)
            })
        })
    }
}