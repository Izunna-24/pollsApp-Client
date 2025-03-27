const colors = [
    '#F44336', '#e91e63', '#9c27b0', '#673ab7',
    '#ff9800', '#ff5722', '#795548', '#607d8b',
    '#3f51b5', '#2196F3', '#00bcd4', '#009688',
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0',
    '#4CAF50', '#ffeb3b', '#ffc107',
];

const hashString = (str) =>
    [...str].reduce((hash, char) => 31 * hash + char.charCodeAt(0), 0);

export function getAvatarColor(name) {
    const hash = Math.abs(hashString(name.slice(0, 6)));
    return colors[hash % colors.length];
}
