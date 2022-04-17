const api = require('./utils/api');
const express = require('express');

const app = express();
app.use(express.json());

// app.post('/api/password/get', async (req, res) => {
//     const { username, password, URIEncode } = req.body;

//     const enPass = URIEncode
//         ? await api.GetEncryptedPasswordURI(username, password)
//         : await api.GetEncryptedPasswordPure(username, password);

//     res.send(enPass);
// });

app.post('/api/login', async (req, res) => {
    const { username, password, URIEncode } = req.body;

    const data = URIEncode
        ? await api.GetLoginDataURI(username, password)
        : await api.GetLoginData(username, password);

    res.send(data);
});

app.post('/api/schedule', async (req, res) => {
    const { username, password } = req.body;
    let { semester, term } = req.body;

    semester = semester == undefined ? 0 : semester;
    term = term == undefined ? 0 : term;

    const data = await api.GetSchedule(username, password, semester, term);
    res.send(data);
});

app.post('/api/lectureStatus', async (req, res) => {
    const { username, password, lecture } = req.body;

    const data = await api.GetLectureStatus(username, password, lecture);
    res.send(data);
});

app.post('/api/homeUrl', async (req, res) => {
    const { username, password } = req.body;

    const data = await api.GetHomeUrl(username, password);
    res.send(data);
});

app.post('/api/attendance', async (req, res) => {
    const { username, password, code } = req.body;

    const data = await api.InputAttendCode(username, password, code);
    res.send(data);
});

app.post('/api/lectureSyllabus', async (req, res) => {
    const { username, password, lecture } = req.body;

    const data = await api.GetLectureSyllabusUrl(username, password, lecture);
    res.send(data);
});

app.post('/api/notification/url', async (req, res) => {
    const { username, password } = req.body;

    const data = await api.GetNotificationUrl(username, password);
    res.send(data);
});
app.post('/api/notification/unreadCount', async (req, res) => {
    const { username, password } = req.body;

    const data = await api.GetUnreadNotificationCount(username, password);
    res.send(data);
});

app.use(express.static('public'));


app.listen(process.env.PORT || 3000, () => {
    console.log('Server started');
});