desc "create directories"
task :mkdir do
    FileUtils.mkdir("./tmp")
end

desc "copy files"
task :copy => [:mkdir] do
    FileUtils.cp_r("./dist/html", "./tmp")
    FileUtils.cp_r("./dist/css", "./tmp")
    FileUtils.cp_r("./dist/js", "./tmp")
    FileUtils.cp_r("./src/icon", "./tmp")
    FileUtils.cp_r("./src/reveal.js", "./tmp")
    FileUtils.cp("./src/manifest.json", "./tmp")
end

desc "compress files"
task :compress => [:copy] do

end

desc "zip directory"
task :archive => [:compress] do
    sh "zip package.zip -r ./tmp/"
end

desc "remove temporary files"
task :remove_tmp do
    if File.exist?("package.zip") then
        FileUtils.rm("package.zip")
    end
    if File.exist?("./tmp") then
        FileUtils.rm_r("./tmp")
    end
end

task :default => [:remove_tmp, :archive]
