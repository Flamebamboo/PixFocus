import ActivityKit
import SwiftUI

struct FizlAttributes: ActivityAttributes {
    public typealias FizlStatus = ContentState
    
    public struct ContentState: Codable, Hashable {
        var startTime: Date
        var endTime: Date
        var title: String
        var headline: String
        var widgetUrl: String
    }
}