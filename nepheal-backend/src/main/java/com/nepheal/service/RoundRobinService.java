package com.nepheal.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RoundRobinService {

    static int TIME_QUANTUM = 3;

    Map<String, Integer> waitingMap = new LinkedHashMap<>();
    List<Integer> waitingTimeList = new ArrayList<>();
    int timePassed = 0;

    public void runRoundRobin() {

        waitingMap.put("p0", 3);
        waitingMap.put("p1", 3);
        waitingMap.put("p2", 3);
        waitingMap.put("p3", 9);

        List<String> processOrder = new ArrayList<>();

        while (!waitingMap.isEmpty()) {
            processOrder.addAll(getRoundRobin(waitingMap));
        }

        System.out.println("Execution Order:");
        System.out.println(processOrder);

        System.out.println("\nWaiting Time List:");
        System.out.println(waitingTimeList);
    }

    public List<String> getRoundRobin(Map<String, Integer> processMap) {

        Map<String, Integer> localMap = new LinkedHashMap<>(processMap);
        waitingMap.clear();

        List<String> currentCycle = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : localMap.entrySet()) {

            String process = entry.getKey();
            int burstTime = entry.getValue();

            currentCycle.add(process);

            int executedTime = Math.min(burstTime, TIME_QUANTUM);
            timePassed += executedTime;
            waitingTimeList.add(timePassed);

            if (burstTime > TIME_QUANTUM) {
                waitingMap.put(process, burstTime - TIME_QUANTUM);
            }
        }

        return currentCycle;
    }
}
