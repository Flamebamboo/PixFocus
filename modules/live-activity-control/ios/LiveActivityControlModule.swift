import ExpoModulesCore
import Foundation
import ActivityKit
import os.log

public class LiveActivityControlModule: Module {
    // Create a logger instance at class level
    private let logger = Logger(subsystem: "com.aurahub.liveactivity", category: "activity")
    
    public func definition() -> ModuleDefinition {
        Name("LiveActivityControl")
        
        Function("areActivitiesEnabled") { () -> Bool in
            self.logger.info("Checking if activities are enabled")
            
            if #available(iOS 16.2, *) {
                return ActivityAuthorizationInfo().areActivitiesEnabled
            } else {
                return false
            }
        }
        
        Function("startActivity") { (startTimeUnix: Double, endTimeUnix: Double, title: String, headline: String, widgetUrl: String, countsDown: Bool) -> Bool in
            self.logger.info("Starting activity: \(title)")
            
            if #available(iOS 16.2, *) {
                let attributes = FizlAttributes()
                let contentState = FizlAttributes.FizlStatus(
                    startTime: Date(timeIntervalSince1970: startTimeUnix),
                    endTime: Date(timeIntervalSince1970: endTimeUnix),
                    title: title,
                    headline: headline,
                    widgetUrl: widgetUrl,
                    countsDown: countsDown
                )
                
                let activityContent = ActivityContent(state: contentState, staleDate: nil)
                
                do {
                    let activity = try Activity.request(
                        attributes: attributes,
                        content: activityContent,
                        pushType: nil
                    )
                    self.logger.info("Activity started: \(activity.id)")
                    return true
                } catch {
                    self.logger.error("Failed to start activity: \(error.localizedDescription)")
                    return false
                }
            }
            return false
        }
        
        Function("endActivity") { (title: String, headline: String, widgetUrl: String) -> Void in
            self.logger.info("Ending activity with title: \(title)")
            
            if #available(iOS 16.2, *) {
                let contentState = FizlAttributes.ContentState(startTime: .now, endTime: .now, title: title, headline: headline, widgetUrl: widgetUrl)
                let finalContent = ActivityContent(state: contentState, staleDate: nil)
                
                Task {
                    for activity in Activity<FizlAttributes>.activities {
                        await activity.end(finalContent, dismissalPolicy: .immediate)
                        self.logger.info("Ending the Live Activity: \(activity.id)")
                    }
                }
            }
        }
    }
}
