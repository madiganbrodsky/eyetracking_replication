library(tidyverse)
source("helpers.R")
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))
setwd('../data')
theme_set(theme_bw())

df = read.csv("example-trials.csv", header = TRUE)
demo = read.csv("example-subject_information.csv", header = TRUE)

##
df =  df %>%
  select(workerid, response, correctAns1, correctAns2) 

#formatting
df$response = gsub("\\[","",df$response)
df$response = gsub("\\]","",df$response)
df$response = gsub("\\'","",df$response)
df = separate(df,response,into=c("click1","click2","click3","click4"),sep=",")

df$correctAns1 = as.character(df$correctAns1)
df$correctAns2 = as.character(df$correctAns2)

df =  df %>%
  mutate(click1corr = ifelse((click1==correctAns1)|(click1==correctAns2),1,0))
##