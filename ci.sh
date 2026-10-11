# Run CI checks for Golang:
set -e
MODULE_NAME=$(head -1 go.mod | cut -c 8-)
printf "> Running CI checks for %s\n" $MODULE_NAME

# Run tests and print detailed test code coverage
echo "> Running tests..."
COVERAGE_FILE="coverage.out"
go test -failfast -coverprofile=$COVERAGE_FILE

echo ""

echo "> Detailed code coverage report:"
go tool cover -func=$COVERAGE_FILE

echo ""

# Build
go build .
echo "> Tests and builds are OK!"

# clean up
rm ./$MODULE_NAME
rm ./$COVERAGE_FILE