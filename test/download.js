const vows = require('vows')
const ytdl = require('..')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const video1 = 'http://www.youtube.com/watch?v=90AiXO1pAiA'
const video2 = 'https://www.youtube.com/watch?v=179MiZSibco'
const video3 = 'https://www.youtube.com/watch?v=AW8OOp2undg'
const video4 = 'https://www.youtube.com/watch?v=yy7EUIR0fic'
const video5 = 'https://www.youtube.com/watch?v=LDDy4m_TiVk'
const video6 = 'http://www.youtube.com/watch?v=NOaxV9N108g'
const subtitleFile = '1 1 1-179MiZSibco.en.vtt'
const thumbnailFile = 'Too Many Twists (Heist Night 5_5)-yy7EUIR0fic.webp'

vows
  .describe('download')
  .addBatch({
    'a video with video format specified': {
      topic: function () {
        'use strict'
        const dl = ytdl(video1, ['-f', '18'])
        const cb = this.callback

        dl.on('error', cb)

        dl.on('info', function (info) {
          let pos = 0
          let progress

          dl.on('data', function (data) {
            pos += data.length
            progress = pos / info.size
          })

          dl.on('end', function () {
            cb(null, progress, info)
          })

          const filepath = path.join(__dirname, info._filename)
          dl.pipe(fs.createWriteStream(filepath))
        })
      },

      'data returned': function (err, progress, data) {
        'use strict'
        if (err) {
          throw err
        }

        assert.strictEqual(progress, 1)
        assert.isObject(data)
        assert.strictEqual(data.id, '90AiXO1pAiA')
        assert.isTrue(/lol-90AiXO1pAiA/.test(data._filename))
      },

      'file was downloaded': function (err, progress, data) {
        'use strict'
        if (err) {
          throw err
        }

        // Check existance.
        const filepath = path.join(__dirname, data._filename)
        const exists = fs.existsSync(filepath)
        if (exists) {
          // Delete file after each test.
          fs.unlinkSync(filepath)
        } else {
          assert.isTrue(exists)
        }
      }
    },
    'a video with audio format specified': {
      topic: function () {
        'use strict'
        const dl = ytdl(video5, ['-f', '251'])
        const cb = this.callback

        dl.on('error', cb)

        dl.on('info', function (info) {
          let pos = 0
          let progress

          dl.on('data', function (data) {
            pos += data.length
            progress = pos / info.size
          })

          dl.on('end', function () {
            cb(null, progress, info)
          })

          const filepath = path.join(__dirname, info._filename)
          dl.pipe(fs.createWriteStream(filepath))
        })
      },

      'data returned': function (err, progress, data) {
        'use strict'
        if (err) {
          throw err
        }

        assert.strictEqual(progress, 1)
        assert.isObject(data)
        assert.strictEqual(data.id, 'LDDy4m_TiVk')
        assert.isTrue(
          /Snelle - Smoorverliefd \(prod\. Donda Nisha\)-LDDy4m_TiVk/.test(
            data._filename
          )
        )
      },

      'file was downloaded': function (err, progress, data) {
        'use strict'
        if (err) {
          throw err
        }

        // Check existance.
        const filepath = path.join(__dirname, data._filename)
        const exists = fs.existsSync(filepath)
        if (exists) {
          // Delete file after each test.
          fs.unlinkSync(filepath)
        } else {
          assert.isTrue(exists)
        }
      }
    },
    'a video with no format specified': {
      topic: function () {
        'use strict'
        const dl = ytdl(video3)
        const cb = this.callback

        dl.on('error', cb)

        dl.on('info', function (info) {
          let pos = 0
          let progress

          dl.on('data', function (data) {
            pos += data.length
            progress = pos / info.size
          })

          dl.on('end', function () {
            cb(null, progress, info)
          })

          const filepath = path.join(__dirname, info._filename)
          dl.pipe(fs.createWriteStream(filepath))
        })
      },

      'data returned': function (err, progress, data) {
        'use strict'
        if (err) {
          throw err
        }

        assert.strictEqual(progress, 1)
        assert.isObject(data)
        assert.strictEqual(data.id, 'AW8OOp2undg')
      },

      'file was downloaded': function (err, progress, data) {
        'use strict'
        if (err) {
          throw err
        }

        // Check existance.
        const filepath = path.join(__dirname, data._filename)
        const exists = fs.existsSync(filepath)
        if (exists) {
          // Delete file after each test.
          fs.unlinkSync(filepath)
        } else {
          assert.isTrue(exists)
        }
      }
    },
    'a video with `filesize: null`': {
      topic: function () {
        'use strict'
        const dl = ytdl(video6)
        const cb = this.callback

        dl.on('error', cb)

        dl.on('info', function (info) {
          let pos = 0
          let progress

          dl.on('data', function (data) {
            pos += data.length
            progress = pos / info.size
          })

          dl.on('end', function () {
            cb(null, progress, info)
          })

          const filepath = path.join(__dirname, info._filename)
          dl.pipe(fs.createWriteStream(filepath))
        })
      },

      'data returned': function (err, progress, data) {
        'use strict'
        if (err) {
          throw err
        }

        assert.strictEqual(progress, 1)
        assert.isObject(data)
        assert.strictEqual(data.id, 'NOaxV9N108g')
      },

      'file was downloaded': function (err, progress, data) {
        'use strict'
        if (err) {
          throw err
        }

        // Check existance.
        const filepath = path.join(__dirname, data._filename)
        const exists = fs.existsSync(filepath)
        if (exists) {
          // Delete file after each test.
          fs.unlinkSync(filepath)
        } else {
          assert.isTrue(exists)
        }
      }
    },
    'a video with subtitles': {
      topic: function () {
        'use strict'
        try {
          fs.unlinkSync(path.join(__dirname, subtitleFile))
        } catch (err) {}
        ytdl.getSubs(video2, { lang: 'en', cwd: __dirname }, this.callback)
      },

      'subtitles were downloaded': function (err, files) {
        'use strict'
        if (err) {
          throw err
        }

        assert.strictEqual(files[0], subtitleFile)
        assert.isTrue(fs.existsSync(path.join(__dirname, subtitleFile)))
        fs.unlinkSync(path.join(__dirname, subtitleFile))
      }
    },
    'a video with thumbnail': {
      topic: function () {
        'use strict'
        try {
          fs.unlinkSync(path.join(__dirname, thumbnailFile))
        } catch (err) {}
        ytdl.getThumbs(video4, { cwd: __dirname }, this.callback)
      },

      'thumbnail was downloaded': function (err, files) {
        'use strict'
        if (err) {
          throw err
        }

        assert.strictEqual(files[0], thumbnailFile)
        assert.isTrue(fs.existsSync(path.join(__dirname, thumbnailFile)))
        fs.unlinkSync(path.join(__dirname, thumbnailFile))
      }
    }
  })
  .export(module)
