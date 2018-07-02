var gulp=require('gulp');  
    spritesmith=require('gulp.spritesmith');  

gulp.task('sprite',function(){  
     gulp.src('assets/*.png')  
        .pipe(spritesmith({  
            imgName:'sprite.png',  
            cssName:'css/inc.css',  
            padding:5,  
            algorithm:'binary-tree'  
        }))  
        .pipe(gulp.dest('123/')) //输出目录
}) 

gulp.task("default", ["sprite"]);