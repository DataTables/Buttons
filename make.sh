#!/bin/bash

DT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."

# If not run from DataTables build script, redirect to there, for setup
if [ -z "$DT_BUILD" ]; then
	cd $DT_DIR/build
	./make.sh extension Buttons $1
	cd -
	exit
else
	OUT_DIR=$1
fi

# Change into script's own dir
cd $(dirname $0)

DT_SRC=$(dirname $(dirname $(pwd)))
DT_BUILT="${DT_SRC}/built/DataTables"
. $DT_SRC/build/include.sh

# Copy CSS
rsync -r css $OUT_DIR
css_frameworks buttons $OUT_DIR/css

# Typescript build
ts_extension Buttons buttons true

rsync -r dist/buttons.*.js $OUT_DIR/js/

VERSION=$(grep "version.*[0-9]\+[.][0-9]\+[.][0-9]" dist/dataTables.buttons.js | perl -nle'print $& if m{\d+\.\d+\.\d+(\-\w*(\-\d+)?)?}')

js_wrap $OUT_DIR/js/buttons.colVis.js $VERSION "datatables.net datatables.net-buttons"
js_wrap $OUT_DIR/js/buttons.html5.js $VERSION "datatables.net datatables.net-buttons"
js_wrap $OUT_DIR/js/buttons.print.js $VERSION "datatables.net datatables.net-buttons"

rm -r dist

# Copy and build examples
rsync -r examples $OUT_DIR
examples_process $OUT_DIR/examples

# Readme and license
cp Readme.md $OUT_DIR
cp License.txt $OUT_DIR

