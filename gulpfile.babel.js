'use strict';
// require("babel/register");
import gulp from "gulp";
// const gulp = require('gulp');
/*
* 编译less templatesJade
* min css js
* watch less js jade文件(实际：复制修改了的文件)
* copy
* clear
* new:======>
* 压缩图片gulp-imagemin
* */
const log = require('util').log;

/*import del from "del";
import changed from "gulp-changed";
import jscs from "gulp-jscs";
import uglify from "gulp-uglify";
// import rename from "gulp-rename";
import nodemon from "gulp-nodemon";
import jade from "gulp-jade";
import jshint from "gulp-jshint";
import concat from "gulp-concat";
import less from "gulp-less";*/
const del = require('del');
const changed = require('gulp-changed');
const jscs = require('gulp-jscs');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const nodemon = require('gulp-nodemon');
const jade = require('gulp-jade');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const less = require('gulp-less');
const minify = require('gulp-minify');
const minifyCss = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const mergeStream = require('merge-stream');
const imageMin = require('gulp-imagemin');

gulp.task('lessCompile',function () {
    log('编译 压缩less...');
    return gulp.src('./src/less/**/*.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .on('error', function(e){
            log(e);
        })
        // .pipe(concat('app.min.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('jsMin',function () {
    log('编译es6 压缩js...');
    return gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(jshint())
        .pipe(uglify())
        .on('error', function(e){
            log(e);
        })
        // .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('jadeTemplateCompile',function () {
    log('编译template jade...');
    return gulp.src('./src/templates/**/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(minify())
        .on('error', function(e){
            log(e);
        })
        .pipe(gulp.dest('./public/templates'));
});

gulp.task('watchCssJsJade',function(){
    log('监听...');
    gulp.watch(['./src/lib/*','./src/images/*'],['copy']);
    gulp.watch('./src/less/**/*.less',['lessCompile']);
    gulp.watch('./src/js/**/*.js',['jsMin']);
    gulp.watch('./src/templates/**/*.jade',['jadeTemplateCompile']);
});

gulp.task('nodemon',function () {
    log('nodemon启动...');
    nodemon({
        script: './bin/www',
        ext: 'html js',
        // ignore: ['ignored.js'],
        // tasks: ['lint']
    })
        .on('restart', function () {
            log('restarted!');
        })
});

gulp.task('copy',function () {
    log('复制...');//'./src/lib/*', './src/images/*',
    var libCopy = gulp.src(['./src/lib/**/*'])
        .pipe(gulp.dest('./public/lib'));
    var imagesCopy = gulp.src(['./src/images/**/*'])
        .pipe(imageMin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./public/images'));
    return mergeStream(libCopy, imagesCopy);
});

gulp.task('clear',function (cb) {
    log('清除...');
    del(['./public/*'],cb);
});
/*gulp.task('min',function(){
    var minCss = gulp.src('./src/lib/components/!*.css')
        .pipe(minifyCss())
        .pipe(concat('components.min.css'))
        .pipe(gulp.dest('./public/lib'));
    var minJs = gulp.src('./src/lib/components/!*.js')
        .pipe(minify())
        .pipe(concat('components.min.js'))
        .pipe(gulp.dest('./public/lib'));
    return mergeStream(minCss, minJs);
});*/
gulp.task('default',
    [
        'clear',
        'lessCompile',
        'jsMin',
        'jadeTemplateCompile',
        'copy',
        'watchCssJsJade'
        // 'nodemon'
    ]);

/*
* , function () {
 return gulp.src('./src')
 // `changed` 任务需要提前知道目标目录位置
 // 才能找出哪些文件是被修改过的
 .pipe(changed('./public'))
 // 只有被更改过的文件才会通过这里
 .pipe(jscs())
 .pipe(uglify())
 .pipe(gulp.dest('./public'));
 }*/