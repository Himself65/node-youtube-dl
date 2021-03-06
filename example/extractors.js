const ytdl = require('..')

ytdl.getExtractors(true, function getExtractors (err, list) {
  if (err) throw err

  console.log('Found ' + list.length + ' extractors')

  const show = 4
  for (let i = 0; i < Math.min(show, list.length); i++) {
    console.log(list[i])
  }

  if (list.length > show) {
    console.log('...' + (list.length - show) + ' not shown')
  }
})
