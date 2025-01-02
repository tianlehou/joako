export function formatWithArrobaBreaks(data) {
    return typeof data === "string" ? data.replace("@", "<br>@") : "";
}
