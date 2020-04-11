FROM adoptopenjdk/openjdk8-openj9:latest
RUN apt-get update && apt-get install -y imagemagick
COPY build/libs/*-all.jar kurate.jar
EXPOSE 8338
CMD java -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -Dcom.sun.management.jmxremote -noverify ${JAVA_OPTS} -jar kurate.jar
