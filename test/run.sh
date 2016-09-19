#!/usr/bin/env bash
if [[ $(./src/index.js ./test/files --dry-run) == "\
HorribleSubs_Mayoiga_-_01.ass > [Leopard-Raws] Mayoiga - 01 RAW (WOWOW 1280x720 x264 AAC).ass
No similar video file name found for HorribleSubs_Mayoiga_-_02.ass
HorribleSubs_Mayoiga_-_03.ass > [Leopard-Raws] Mayoiga - 03 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_04.ass > [Leopard-Raws] Mayoiga - 04 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_05.ass > [Leopard-Raws] Mayoiga - 05 RAW (WOWOW 1280x720 x264 AAC).ass
HorribleSubs_Mayoiga_-_06.ass > [Leopard-Raws] Mayoiga - 06 RAW (WOWOW 1280x720 x264 AAC).ass
No similar video file name found for HorribleSubs_Mayoiga_-_07.ass
No similar video file name found for HorribleSubs_Mayoiga_-_08.ass
No similar video file name found for HorribleSubs_Mayoiga_-_09.ass
HorribleSubs_Mayoiga_-_10.ass > [Leopard-Raws] Mayoiga - 10 RAW (WOWOW 1280x720 x264 AAC).ass
No similar video file name found for HorribleSubs_Mayoiga_-_11.ass
No similar video file name found for HorribleSubs_Mayoiga_-_12.ass" ]];
  then echo "Success!"; exit 0
  else echo "Failure!"; exit 1
fi
