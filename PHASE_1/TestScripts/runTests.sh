#!/bin/sh

echo "Running Tests"

# Performs all the required curls for generating actual data.
sh getData.sh

# Performs all the difference checks between expected and actual data.
sh performTest.sh

# Sets files back to normal.
sh reconfigure.sh