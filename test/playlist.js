const vows = require('vows')
const ytdl = require('..')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const video1 = 'https://www.youtube.com/playlist?list=PLEFA9E9D96CB7F807'

vows
  .describe('download playlist')
  .addBatch({
    'from a youtube playlist': {
      topic: function () {
        'use strict'

        const cb = this.callback
        const details = []
        let count = 0

        function playlist (url) {
          const dl = ytdl(url)

          dl.on('error', cb)

          dl.on('info', function (info) {
            let pos = 0
            let progress

            dl.on('data', function (data) {
              pos += data.length
              progress = pos / info.size
            })

            dl.on('end', function () {
              details.push({ progress: progress, data: info })
              count = count + 1
              if (count === 2) {
                return cb(null, details)
              }
            })

            dl.on('next', playlist)

            const filepath = path.join(__dirname, info._filename)
            dl.pipe(fs.createWriteStream(filepath))
          })
        }

        playlist(video1)
      },
      'data returned': function (err, data) {
        'use strict'
        if (err) {
          throw err
        }
        assert.strictEqual(data.length, 2)
        assert.isArray(data)
        assert.isObject(data[0])
        assert.isObject(data[1])
      },
      'files downloaded': function (err, data) {
        'use strict'
        if (err) {
          throw err
        }
        assert.strictEqual(data[0].progress, 1)
        assert.strictEqual(
          data[0].data._filename,
          'Amy Castle - The Original Cuppycake Video-12Z6pWhM6TA.mp4'
        )
        assert.strictEqual(data[1].progress, 1)
        assert.strictEqual(
          data[1].data._filename,
          'LA REGAÑADA DEL MILENIO.wmv-SITuxqDUjPI.mp4'
        )

        function fileExists (data) {
          const filepath = path.join(__dirname, data._filename)
          const exists = fs.existsSync(filepath)

          if (exists) {
            // Delete file after each test.
            fs.unlinkSync(filepath)
          } else {
            assert.isTrue(exists)
          }
        }

        fileExists(data[0].data)
        fileExists(data[1].data)
      }
    },
    'thumbnails of a playlist': {
      topic: function () {
        'use strict'
        ytdl.getThumbs(video1, { cwd: __dirname }, this.callback)
      },

      'data returned': function (err, files) {
        'use strict'
        if (err) {
          throw err
        }

        assert.strictEqual(
          files[0],
          'Amy Castle - The Original Cuppycake Video-12Z6pWhM6TA.jpg'
        )
        assert.strictEqual(
          files[1],
          'LA REGAÑADA DEL MILENIO.wmv-SITuxqDUjPI.jpg'
        )
      },

      'thumbnails were downloaded': function (err, files) {
        'use strict'
        if (err) {
          throw err
        }
        assert.isTrue(fs.existsSync(path.join(__dirname, files[0])))
        assert.isTrue(fs.existsSync(path.join(__dirname, files[1])))
        fs.unlinkSync(path.join(__dirname, files[0]))
        fs.unlinkSync(path.join(__dirname, files[1]))
      }
    }
  })
  .export(module)
