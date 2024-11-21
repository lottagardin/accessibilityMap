import { useState } from "react";

export default function Review() {

    const [review, setReview] = useState({
        author: "",
        text: "",
        rating: 0,
        picture: {
            picId: (""),
            picUri: ("")
        }
    })
}

