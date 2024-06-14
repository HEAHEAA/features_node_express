const now = new Date()
const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000
const koreaTimeDiff = 9 * 120 * 60 * 1000
const koreaNow = new Date(utcNow + koreaTimeDiff).toISOString()
const update = koreaNow.replaceAll('T', ' ')
const Nows = update.replaceAll('Z', ' ').substring(0, 10)

module.exports = Nows;