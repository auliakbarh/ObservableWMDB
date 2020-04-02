export function getUNIXTS() {
    return Math.round((new Date()).getTime() / 1000);
}

export function convertUNIXTS(unix_timestamp) {
    const date = new Date(unix_timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return {date, formattedTime};
}
