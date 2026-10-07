#!/usr/bin/env bash
# Tunnel the dev backend (8080) and Metro (8081) from every connected Android
# device to this machine, so EXPO_PUBLIC_API_URL=http://localhost:8080 works.
ADB="${ANDROID_HOME:-$HOME/Android/Sdk}/platform-tools/adb"
command -v adb >/dev/null && ADB=adb
for d in $("$ADB" devices | awk 'NR>1 && $2=="device" {print $1}'); do
  "$ADB" -s "$d" reverse tcp:8080 tcp:8080 >/dev/null &&
    "$ADB" -s "$d" reverse tcp:8081 tcp:8081 >/dev/null &&
    echo "adb reverse 8080/8081 -> $d"
done
exit 0
