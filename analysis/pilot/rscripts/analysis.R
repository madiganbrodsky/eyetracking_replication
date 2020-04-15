library(tidyverse)
source("helpers.R")
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))
setwd('../data')
theme_set(theme_bw())

df = read.csv("example-trials.csv", header = TRUE)
demo = read.csv("example-subject_information.csv", header = TRUE)

#formatting
df$response = gsub(" ","",df$response)
df$response = gsub("\\[","",df$response)
df$response = gsub("\\]","",df$response)
df$response = gsub("\\'","",df$response)
df$response = gsub("AOI","",df$response)

df = separate(df,response,into=c("click1","click2","click3","click4"),sep=",")

toplot =  df %>%
  filter(ExpFiller=="Exp") %>%
  select(workerid,condition,size,click1,click2,click3,click4,target1,target2,competitor1,competitor2,instruction3) %>%
  mutate(ID = row_number()) %>%
  gather(click_number,location,click1:click4) %>%
  mutate(target=ifelse(location==target1,1,ifelse(location==target2,1,0))) %>%
  mutate(competitor=ifelse(location==competitor1,1,ifelse(location==competitor2,1,0))) %>%
  group_by(condition,size,click_number) %>%
  summarize(m_target=mean(target),m_competitor=mean(competitor),ci_low_target=ci.low(target),ci_high_target=ci.high(target),ci_low_competitor=ci.low(competitor),ci_high_competitor=ci.high(competitor)) %>%
  gather(location,Mean,m_target:m_competitor) %>%
  mutate(CILow=ifelse(location=="m_target",ci_low_target,ifelse(location=="m_competitor",ci_low_competitor,0))) %>%
  mutate(CIHigh=ifelse(location=="m_target",ci_high_target,ifelse(location=="m_competitor",ci_high_competitor,0))) %>%
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>%
  mutate(Region=fct_recode(location,"competitor"="m_competitor","target"="m_target")) %>%
  mutate(Region=fct_rev(Region))

proportions = ggplot(toplot, aes(x=click_number, y=Mean, group=Region)) +
  geom_line(aes(color=Region),size=1.3) +
  geom_point(aes(color=Region),size=3.5,shape="square") +
  geom_errorbar(aes(ymin=YMin, ymax=YMax), width=.2, alpha=.3) +
  facet_grid(size ~condition) + 
  scale_color_manual(values=c("darkgreen","orange")) +
  xlab("Window") +
  ylab("Proportion of clicks") +
  theme(axis.title.x=element_text(size=15),
        axis.title.y=element_text(size=15),
        strip.text.x=element_text(size=15),
        axis.text.x=element_text(size=12),
        axis.text.y=element_text(size=14))

proportions

ggsave(proportions, file="../graphs/proportions.pdf")

