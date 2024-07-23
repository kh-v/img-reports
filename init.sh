#!/bin/sh

BASEDIR=$(dirname "$0")
cd $BASEDIR

# Storage Directories
STORAGEDIR="storage"
echo $STORAGEDIR
if [ ! -d "$STORAGEDIR" ]; then
  mkdir $STORAGEDIR
elif [ -f $STORAGEDIR ]; then
  echo "$STORAGEDIR already exists but is not a directory" 1>&2
else
  echo "$STORAGEDIR exists" 1>&2
fi

# imgages Directories
IMGDIR="storage/images"
echo $IMGDIR
# rm -rf $IMGDIR
if [ ! -d "$IMGDIR" ]; then
  mkdir $IMGDIR
  mkdir "$IMGDIR/server"
  mkdir "$IMGDIR/client"
  mkdir "$IMGDIR/backend"
elif [ -f $IMGDIR ]; then
  echo "$IMGDIR already exists but is not a directory" 1>&2
else
  echo "$IMGDIR exists" 1>&2
fi

# Log Directories
LOGSDIR="storage/logs"
echo $LOGSDIR
# rm -rf $LOGSDIR
if [ ! -d "$LOGSDIR" ]; then
  mkdir $LOGSDIR
  mkdir "$LOGSDIR/server"
  mkdir "$LOGSDIR/client"
  mkdir "$LOGSDIR/backend"
elif [ -f $LOGSDIR ]; then
  echo "$LOGSDIR already exists but is not a directory" 1>&2
else
  echo "$LOGSDIR exists" 1>&2
fi

# Models
MODELDIR="storage/models"
echo $MODELDIR
# rm -rf $MODELDIR
if [ ! -d "$MODELDIR" ]; then
  mkdir $MODELDIR
  echo "[]" > "$MODELDIR/users.json"
  echo "[\t\"http://localhost\",\n\t\"http://localhost:3000\",\n\t\"http://localhost:8081\",\n\t\"http://127.0.0.1:3001\",\n\t\"http://localhost:3003\",\n\t\"http://localhost:3002\",\n\t\"http://img.kh-lab.online\",\n\t\"https://img.kh-lab.online\"\n]" > "$MODELDIR/corsAllowed.json"
elif [ -d $MODELDIR ]; then
  echo "$MODELDIR already exists" 1>&2
elif [ -f $MODELDIR ]; then
  echo "$MODELDIR already exists but is not a directory" 1>&2
else
  echo "$MODELDIR exists" 1>&2
fi

