# rexsub
Automagically **r**enames **ex**ternal **sub**titles by matching subtitle vs video filename.

#### Example
Running `./index.js ./test` from project directory will output:
```
./test/narcos.s02e01.720p.webrip.x264-skgtv.srt > ./test/Narcos 2 - 01.srt
./test/narcos.s02e02.720p.webrip.x264-skgtv.srt > ./test/Narcos 2 - 02.srt
./test/narcos.s02e10.720p.webrip.x264-skgtv.srt > ./test/Narcos 2 - 10.srt
```
Use `--dry-run` argument to review the changes before commiting them.