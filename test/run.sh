#!/usr/bin/env bash

failed_test_count=0

if [[ $(./src/index.js ./test/mayoiga --dry-run --verbose) != "\
HorribleSubs_Mayoiga_-_01.ass > [Leopard-Raws] Mayoiga - 01 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_02.ass > [Leopard-Raws] Mayoiga - 02 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_03.ass > [Leopard-Raws] Mayoiga - 03 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_04.ass > [Leopard-Raws] Mayoiga - 04 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_05.ass > [Leopard-Raws] Mayoiga - 05 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_06.ass > [Leopard-Raws] Mayoiga - 06 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_10.ass > [Leopard-Raws] Mayoiga - 10 RAW (WOWOW 1280x720 x264 AAC).ass" ]];
    then ((failed_test_count++));
fi

if [[ $(./src/index.js ./test/narcos\ 2 --dry-run --verbose) != "\
narcos.s02e01.720p.webrip.x264-skgtv.srt > Narcos 2 - 01.srt
narcos.s02e02.720p.webrip.x264-skgtv.srt > Narcos 2 - 02.srt
narcos.s02e10.720p.webrip.x264-skgtv.srt > Narcos 2 - 10.srt" ]];
    then ((failed_test_count++));
fi

if [[ $(./src/index.js ./test/digits --dry-run --verbose) != "\
foo.s02e06.dvdrip.xvid-bla.srt > Foo S02E06 Bar.srt
foo.s02e16.dvdrip.xvid-bla.srt > Foo S02E16 Bar.srt" ]];
    then ((failed_test_count++));
fi

if [[ failed_test_count -eq 0 ]];
    then echo "Success!"; exit 0
    else echo "Failed test(s): ${failed_test_count}"; exit 1
fi
