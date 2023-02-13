#!/bin/bash

# Source: https://stackoverflow.com/questions/16483119/an-example-of-how-to-use-getopts-in-bash
# Retrieved Feb 12, 2023

function get_variable_name_for_option {
    local OPT_DESC=${1}
    local OPTION=${2}
    local VAR=$(echo ${OPT_DESC} | sed -e "s/.*\[\?-${OPTION} \([A-Z_]\+\).*/\1/g" -e "s/.*\[\?-\(${OPTION}\).*/\1FLAG/g")

    if [[ "${VAR}" == "${1}" ]]; then
        echo ""
    else
        echo ${VAR}
    fi
}

function parse_options {
    local OPT_DESC=${1}
    local INPUT=$(get_input_for_getopts "${OPT_DESC}")

    shift
    while getopts ${INPUT} OPTION ${@};
    do
        [ ${OPTION} == "?" ] && usage
        VARNAME=$(get_variable_name_for_option "${OPT_DESC}" "${OPTION}")
            [ "${VARNAME}" != "" ] && eval "${VARNAME}=${OPTARG:-true}" # && printf "\t%s\n" "* Declaring ${VARNAME}=${!VARNAME} -- OPTIONS='$OPTION'"
    done

    check_for_required "${OPT_DESC}"

}

function check_for_required {
    local OPT_DESC=${1}
    local REQUIRED=$(get_required "${OPT_DESC}" | sed -e "s/\://g")
    while test -n "${REQUIRED}"; do
        OPTION=${REQUIRED:0:1}
        VARNAME=$(get_variable_name_for_option "${OPT_DESC}" "${OPTION}")
                [ -z "${!VARNAME}" ] && printf "ERROR: %s\n" "Option -${OPTION} must been set." && usage
        REQUIRED=${REQUIRED:1}
    done
}

function get_input_for_getopts {
    local OPT_DESC=${1}
    echo ${OPT_DESC} | sed -e "s/\([a-zA-Z]\) [A-Z_]\+/\1:/g" -e "s/[][ -]//g"
}

function get_optional {
    local OPT_DESC=${1}
    echo ${OPT_DESC} | sed -e "s/[^[]*\(\[[^]]*\]\)[^[]*/\1/g" -e "s/\([a-zA-Z]\) [A-Z_]\+/\1:/g" -e "s/[][ -]//g"
}

function get_required {
    local OPT_DESC=${1}
    echo ${OPT_DESC} | sed -e "s/\([a-zA-Z]\) [A-Z_]\+/\1:/g" -e "s/\[[^[]*\]//g" -e "s/[][ -]//g"
}

function usage {
    printf "Usage:\n\t%s\n" "${0} ${OPT_DESC}"
    exit 10
}