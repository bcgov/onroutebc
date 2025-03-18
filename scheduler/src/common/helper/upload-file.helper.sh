#!/bin/bash

# Check if the right number of arguments are passed
if [ $# -ne 6 ]; then
  echo "Usage: $0 <source_file> <destination_file> <record_length> <host> <user> <pwd>"
  exit 1
fi

# Get the source and destination file from the arguments
SOURCE_FILE=$1
DESTINATION_FILE=$2
RECORD_LENGTH=$3
HOST=$4
USER=$5
PWD=$6

# Disable cache
lftp <<EOF
set cache:enable no             # disable cache
set ftp:passive-mode on         # use active mode so server controls transfer
set ftp:use-size no             # size may not be supported by mainframe for SSL
set ftp:ssl-protect-data true   # protect data with SSL
set ftp:ssl-force true          # enforce SSL
set ftp:ssl-auth TLS            # use TLS for SSL authentication
set ssl:verify-certificate no   # disable certificate verification
set ftps:initial-prot "P"       # protect data channel from the start
set net:connection-limit 1      # limit connections to 1
set net:max-retries 1           # retry once
debug 5                         # debug level, to see only greeting and error messages

# Open the FTP connection
open "$HOST"

# User login
user "$USER" "$PWD"

# Set the LRecl and then upload the file
quote SITE LRecl="$RECORD_LENGTH"
put -a "$SOURCE_FILE" -o "'$DESTINATION_FILE'"
EOF