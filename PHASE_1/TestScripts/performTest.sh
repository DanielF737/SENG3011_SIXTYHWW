#!/bin/sh

echo "Performing Tests"

# Checks differences between all files in outputs folder.
for file in outputs/*.actual
do
  fileName=`echo $file | sed 's/^.*[/]//g' | sed 's/\.actual//g'`
  if diff $file outputs/"$fileName.expected"
  then
    echo "$fileName Passed"
  else
    echo "$fileName Failed"
  fi
done