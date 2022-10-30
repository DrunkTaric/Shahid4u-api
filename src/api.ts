import { parse } from 'node-html-parser';

class page {
    constructor() {

    }
    get_object_src() { //function for getting the movie/series's src video to download

    }
}

export class api {
    constructor() {
    }
    get_data(raw_page: string) { //function for parsing movies/series data from the actual page
        const $ = parse(raw_page)
        const data = $.querySelectorAll(".media-block")
        if (data.length <= 0) return null
        for (let i of data) {
            //link  => i.getElementsByTagName("a")[0].attrs["href"]
            //title => i.getElementsByTagName("a")[0].attrs["title"]
            //image => i.getElementsByTagName("img")[0].attrs["data-image"]\
        }

    }
    get_search() { //function for getting the page raw data

    }
    get_max_page_number() { // function for getting how many page are they to search in them

    }
}