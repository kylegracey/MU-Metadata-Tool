Made to work with Exiftool.

1) Run the script below on the directory you're looking to upload.
exiftool -j -SourceFile -FileName -HierarchicalSubject -Keywords -Subject -CreateDate -CreatedDate -DateCreated -DateTimeCreated -DateTimeOriginal -FileAccessDate -r [Path to Directory] > [Path to Output File].json

2) Run tool on that json file

3) Use eval to find and update any issues
