#!/bin/sh

DT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."
if [ "$1" = "debug" ]; then
	DEBUG="debug"
else
	OUT_DIR=$1
	DEBUG=$2
fi

# If not run from DataTables build script, redirect to there
if [ -z "$DT_BUILD" ]; then
	cd $DT_DIR/build
	./make.sh extension Buttons $DEBUG
	cd -
	exit
fi

# Change into script's own dir
cd $(dirname $0)

DT_SRC=$(dirname $(dirname $(pwd)))
DT_BUILT="${DT_SRC}/built/DataTables"
. $DT_SRC/build/include.sh

# Copy CSS
rsync -r css $OUT_DIR
css_frameworks buttons $OUT_DIR/css

# Copy images
#rsync -r images $OUT_DIR

# Copy JS
rsync -r js $OUT_DIR
js_wrap $OUT_DIR/js/dataTables.buttons.js "jquery datatables.net"
js_frameworks buttons $OUT_DIR/js "jquery datatables.net-FW datatables.net-buttons"

js_wrap $OUT_DIR/js/buttons.colVis.js "jquery datatables.net datatables.net-buttons"
js_wrap $OUT_DIR/js/buttons.html5.js "jquery datatables.net datatables.net-buttons"
js_wrap $OUT_DIR/js/buttons.print.js "jquery datatables.net datatables.net-buttons"

# Copy Types
if [ -d $OUT_DIR/types ]; then
	rm -r $OUT_DIR/types		
fi
mkdir $OUT_DIR/types

if [ -d types/ ]; then
	cp types/* $OUT_DIR/types
else
	if [ -f types.d.ts ]; then
		cp types.d.ts $OUT_DIR/types
	fi
fi

# Copy and build examples
rsync -r examples $OUT_DIR
examples_process $OUT_DIR/examples

# Readme and license
cp Readme.md $OUT_DIR
cp License.txt $OUT_DIR

