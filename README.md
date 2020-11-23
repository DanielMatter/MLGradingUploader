# ML Grading Uploader
This tool helps the ML-tutors to upload the corrected PDFs and enter the students' scores.


## Setup
You will need to have `Node.js` installed. Further, you need to be able to run `Typescript`, e.g. by having `ts-node` installed.

To install all dependencies, run `npm install`.

## Usage
### Folder structure
This software requires a certain folder structure. Lets say `/root` is the folder you have your files in.
`/root/[GR_NR] Name 1 Name 2/[PTS]_rest of file`. Here `[GR_NR]` is the group number for the submission. `[PTS]` is the number of points you assigned to the submission.
Please note, that no ungraded solution must match `**/[0-9]_.*\.pdf` (i.e. the pdf-files must not start with 0_ if they are not graded).

#### Example
If you download all assignments from moodle, you will get something like `/root/001 Max Mustermann/mysolution.pdf`. After grading, this must be `/root/001 Max Mustermann/3_mysolution.pdf`.


### Configuration
To upload the graded solutions, you must provide the folder they are in (the path `/root/` from the example), your moodle username and password, as well as the week you are grading.

There are two ways to configure the software.
You can either add a `.env` file inside the main folder, or use console input. 
The `.env` file can contain the keys `USERNAME`, `PASSWORD`, `FOLDER`, and `WEEK`. If any of these keys is not present in the file, or the file is missing entirely, you will be asked at runtime.
I recommend putting `USERNAME`, and `PASSWORD` into `.env` and inputting the remaining values when running.

Lastly, the `.env` can contain `HEADLESS`. If this is set to `true`, there will be no visual feedback, i.e. no browser window.

### Running
To run the program, use `ts-node ./src/index.ts`.