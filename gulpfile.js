//Require the Gulp Module for the Gulp Task Runner
const gulp = require("gulp");

//Require the Gulp-Sass Module for converting the SASS to CSS
const sass = require("gulp-sass")(require("node-sass"));
//Require the Gulp-CSSNano Module for Minifying the CSS
const cssnano = require("gulp-cssnano");
//Require the Gulp-Rev Module for Renaming the CSS Files
const rev = require("gulp-rev");
//Require the Uglify Module for Minifying the JS
const uglify = require("gulp-uglify-es").default;
//Require the ImageMin Module for Minifying the Images
const imagemin = require("gulp-imagemin");
//Require the Del Module for Deleting the Old CSS Files
const del = require("del");

gulp.task("css", (done) => {
	console.log("Minifying CSS...");
	//** means any folder and sub-folders inside
	//**/!(*.min.css) means any file that does not have the .min.css extension
	//* means any file
	gulp
		//Finds all the SASS files in the assets/scss folder
		.src("./assets/sass/**/*.scss")
		//The File will pass through the Gulp SASS Module and convert it to CSS
		.pipe(sass())
		//The File will pass through the Gulp CSSNano Module and minify it
		.pipe(cssnano())
		//Stores the file in the assets/css folder
		.pipe(gulp.dest("./assets.css"));
	//Pipe is a function which is calling all these Sub-Middlewares in Gulp

	console.log("Minified CSS...");
	//Finds the CSS files in the assets/css folder

	gulp
		.src("./assets/**/*.css")
		//The File will pass through the Gulp Rev Module and rename it
		.pipe(rev())
		//Stores the file in the /public/assets/css folder
		.pipe(gulp.dest("./public/assets"))
		//Creates & Stores a Manifest File
		.pipe(
			rev.manifest({
				//Current Working Directory is public as we are taking everything from the public folder
				cwd: "public",
				//If the name already exists, it will not change it, but will merge it with the original files
				merge: true,
			})
		)
		//Stores the Manifest File in the /public/assets folder
		.pipe(gulp.dest("./public/assets"));

	done();
});

gulp.task("js", (done) => {
	console.log("Minifying JavaScript...");
	gulp
		.src("./assets/**/*.js")
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest("./public/assets"))
		.pipe(
			rev.manifest({
				cwd: "public",
				merge: true,
			})
		)
		.pipe(gulp.dest("./public/assets"));
	console.log("Minified JavaScript...");
	done();
});
