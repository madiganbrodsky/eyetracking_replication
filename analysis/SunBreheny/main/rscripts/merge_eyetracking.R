library(tidyverse)
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))
source("helpers.R")
setwd('../data')
theme_set(theme_bw())

# eye-tracking data from Sun&Breheny ---> not sure about these variables: TrialId, mean, subject, unique,TETTime, RTTime, time
baseline = read.csv("sb_eyetracking/exp200ms_beselinedata.csv", header = TRUE)
gender = read.csv("sb_eyetracking/exp200ms_genderdata.csv", header = TRUE)
determiner = read.csv("sb_eyetracking/exp200ms_determiner.csv", header = TRUE)
name = read.csv("sb_eyetracking/exp200ms_namedata.csv", header = TRUE)
end = read.csv("sb_eyetracking/exp200ms_enddata.csv", header = TRUE)
preview = read.csv("sb_eyetracking/exp200ms_previewdata.csv", header = TRUE)

# order should be: baseline / gender / determiner + name / noun ---> not sure about "preview"
g = rbind(baseline,gender,determiner,name,end)

# incremental decision data 
s = read.csv("trials_merged.csv", header = TRUE)
s$response = gsub(" ","",s$response)
s$response = gsub("\\[","",s$response)
s$response = gsub("\\]","",s$response)
s$response = gsub("\\'","",s$response)
s$response = gsub("AOI","",s$response)

############################################
selection = s %>%
  filter(ExpFiller=="Exp") %>%
  separate(response,into=c("baseline","gender","determiner+name","noun"),sep=",") %>%
  gather(window,location,baseline:noun) %>%
  select(workerid,Prime,condition,determiner,size,window,location,target1,target2,competitor1,competitor2) %>%
  mutate(targetclick=ifelse(location==target1,1,ifelse(location==target2,1,0))) %>%
  mutate(competitorclick=ifelse(location==competitor1,1,ifelse(location==competitor2,1,0))) %>%
  mutate(distractorclick=ifelse(targetclick=="1",0,ifelse(competitorclick=="1",0,1))) %>%
  group_by(determiner,size,window) %>%
  summarize(Mean_target_selection=mean(targetclick),Mean_competitor_selection=mean(competitorclick),Mean_distractor_selection=mean(distractorclick))

gaze =  g %>%
  filter(TrackLoss=="FALSE") %>%
  select(Prime,condition,determiner,size,targetlook,competitorlook,whichword) %>%
  mutate(distractorlook=ifelse(targetlook=="1",0,ifelse(competitorlook=="1",0,1))) %>%
  mutate(targetdistractorlook = ifelse(targetlook=="1",1,ifelse(distractorlook=="1",1,0))) %>%
  mutate(competitordistractorlook = ifelse(competitorlook=="1",1,ifelse(distractorlook=="1",1,0))) %>%
  mutate(window=as.character(whichword)) %>%
  mutate(window = ifelse(whichword =="determiner","determiner+name", ifelse(whichword=="name","determiner+name",ifelse(whichword=="end","noun",window)))) %>%
  group_by(determiner,size,window) %>%
  summarize(Mean_target_look=mean(targetlook),Mean_competitor_look=mean(competitorlook),Mean_distractor_look=mean(distractorlook),Mean_targetdistractor_look=mean(targetdistractorlook),Mean_competitordistractor_look=mean(competitordistractorlook))

df = merge(selection, gaze, by=c("determiner","size","window"))
df$window_re<- factor(df$window, levels = c("baseline","gender","determiner+name","noun"))

# target look & target selection
target = ggplot(df, aes(x=Mean_target_selection, y=Mean_target_look)) +
  geom_point(aes(color=window_re),size=2) +
  geom_smooth(method='lm',size=1,color="grey26") +
  xlim(0:1) +
  ylim(0:1) +
  coord_fixed()
target

ggsave(target, file="../graphs/target.pdf",width=8,height=4)

# competitor look & competitor selection
competitor = ggplot(df, aes(x=Mean_competitor_selection, y=Mean_competitor_look)) +
  geom_point(aes(color=window_re),size=2) +
  geom_smooth(method='lm',size=1,color="grey26") +
  xlim(0:1) +
  ylim(0:1) +
  coord_fixed()
competitor

ggsave(competitor, file="../graphs/competitor.pdf",width=8,height=4)

# distractor look & distractor selection
distractor = ggplot(df, aes(x=Mean_distractor_selection, y=Mean_distractor_look)) +
  geom_point(aes(color=window_re),size=2) +
  geom_smooth(method='lm',size=1,color="grey26") +
  xlim(0:1) +
  ylim(0:1) +
  coord_fixed()
distractor

ggsave(distractor, file="../graphs/distractor.pdf",width=8,height=4)

# lump distractors looks with target looks
targetdistractor = ggplot(df, aes(x=Mean_target_selection, y=Mean_targetdistractor_look)) +
  geom_point(aes(color=window_re),size=2) +
  geom_smooth(method='lm',size=1,color="grey26") +
  xlim(0:1) +
  ylim(0:1) +
  coord_fixed()
targetdistractor

ggsave(targetdistractor, file="../graphs/targetdistractor.pdf",width=8,height=4)

# lump distractor looks with competitor looks
competitordistractor = ggplot(df, aes(x=Mean_competitor_selection, y=Mean_competitordistractor_look)) +
  geom_point(aes(color=window_re),size=2) +
  geom_smooth(method='lm',size=1,color="grey26") +
  xlim(0:1) +
  ylim(0:1) +
  coord_fixed()

competitordistractor

ggsave(competitordistractor, file="../graphs/competitordistractor.pdf",width=8,height=4)

