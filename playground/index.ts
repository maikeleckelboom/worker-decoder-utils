import { bufferToBlobUrl, loadImageFromFetch } from "..";

async function demo() {
    // Using sync strategy:
    const url1 = bufferToBlobUrl([new Uint8Array([/* ... */])], "image/png", "sync");
    console.log(url1);

    // Using shared worker strategy:
    const url2 = await bufferToBlobUrl(
        [new Uint8Array([/* ... */])],
        "image/jpeg",
        "shared"
    );
    console.log(url2);

    // Loading image from fetch:
    const img = await loadImageFromFetch("/path/to/image.png");
    document.body.appendChild(img);
}

demo().then(r => {
    console.log("Demo completed", r);
});
