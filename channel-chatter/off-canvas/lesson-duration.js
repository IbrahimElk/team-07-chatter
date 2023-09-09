/**
 * Updates a progress bar to show the progress of the current classroom session.
 * If the class has ended, it alerts the user and redirects them to the home page.
 * @param {HTMLDivElement} bar - The progress bar to be updated.
 * @returns - Nothing.
 */
export function makeProgress(client, bar) {
    const classRoom = client.getCurrentClassRoom();
    if (!classRoom) {
        return;
    }
    const startTime = classRoom.startTime;
    const endTime = classRoom.endTime;
    const remainingTime = endTime - Date.now();
    const totalTime = endTime - startTime;
    const percentage = Math.round(((totalTime - remainingTime) / totalTime) * 100);
    bar.style.width = `${percentage}%`;
    bar.innerText = `${percentage}%`;
    if (remainingTime < 0) {
        alert('The class has ended. Click ok to go back to the landing page.');
        window.location.href = '../home/home.html';
        return;
    }
    setTimeout(() => makeProgress(client, bar), 5000);
}
//# sourceMappingURL=lesson-duration.js.map