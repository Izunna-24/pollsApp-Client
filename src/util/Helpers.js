const monthNamesFull = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];

const monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function formatDate(dateString) {
    const date = new Date(dateString);
    return `${monthNamesFull[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${date.getDate()} ${monthNamesShort[date.getMonth()]} ${date.getFullYear()} - ${hours}:${minutes}`;
}
